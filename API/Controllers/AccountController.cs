using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        // [HttpPost("register")] //POST: api/account/register
        // public async Task<ActionResult<AppUser>> Register(string userName, string password)
        // {
        //     using var hmac = new HMACSHA512();// implement hash Algorithom
        //     var user = new AppUser
        //     {
        //         UserName = userName,
        //         PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
        //         PasswordSalt = hmac.Key
        //     };
        //     _context.Users.Add(user);
        //     await _context.SaveChangesAsync();
        //     return user;
        // }
        [HttpPost("register")] //POST: api/account/register
        //public async Task<ActionResult<AppUser>> Register([FromBody] RegisterDto registerDto)
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.UserName)) return BadRequest("Username is taken");
            using var hmac = new HMACSHA512();// implement hash Algorithom
            var user = new AppUser
            {
                UserName = registerDto.UserName.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserDto
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){

            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.UserName);
            if (user == null) return Unauthorized();// require ActionResult Task<ActionResult<AppUser>>
            using var hmac = new HMACSHA512(user.PasswordSalt);// require Password salt to get exact hash algorithom
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
              for(int i=0;i<computedHash.Length; i++){
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password!!");
              }
            return new UserDto
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<bool> UserExists(string userName)
        {
            return await _context.Users.AnyAsync(x => x.UserName==userName.ToLower());
        }
    }
}