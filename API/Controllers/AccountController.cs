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
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;

        //private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        // public AccountController(DataContext context, ITokenService tokenService,IMapper mapper)
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            // _context = context;
            _tokenService = tokenService;
            _mapper = mapper;
        }


        [HttpPost("register")] //POST: api/account/register
        //public async Task<ActionResult<AppUser>> Register([FromBody] RegisterDto registerDto)
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.UserName)) return BadRequest("Username is taken");

            var user = _mapper.Map<AppUser>(registerDto);

            // using var hmac = new HMACSHA512();// implement hash Algorithom

            user.UserName = registerDto.UserName.ToLower();
            // user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            // user.PasswordSalt = hmac.Key;

            // _context.Users.Add(user);
            // await _context.SaveChangesAsync();

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");
            
            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){

            var user = await _userManager.Users
                 .Include(p=>p.Photos)
                 .SingleOrDefaultAsync(x => x.UserName == loginDto.UserName);
            if (user == null) return Unauthorized("Invalid User Name");// require ActionResult Task<ActionResult<AppUser>>
            // using var hmac = new HMACSHA512(user.PasswordSalt);// require Password salt to get exact hash algorithom
            // var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            //   for(int i=0;i<computedHash.Length; i++){
            //     if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password!!");
            //   }

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result) return Unauthorized("Invalid Password");
            
            return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl=user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender=user.Gender
            };
        }

        private async Task<bool> UserExists(string userName)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName==userName.ToLower());
        }
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
}