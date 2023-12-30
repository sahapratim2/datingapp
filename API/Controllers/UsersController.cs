using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;


[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var users = await _userRepository.GetMembersAsync();

        return Ok(users);

        // var users= await _userRepository.GetUsersAsync();

        // var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);

        // return Ok(usersToReturn);
    }
/*
    // Without Async
    [HttpGet]
    public ActionResult<IEnumerable<AppUser>> GetUsers1()
    {
        var users = _context.Users.ToList();
        return users;
    }
*/
    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string userName)
    {

        return await _userRepository.GetMemberAsync(userName);
        // var user= await _userRepository.GetUserByUserNameAsync(username);
        // return _mapper.Map<MemberDto>(user);

    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userRepository.GetUserByUserNameAsync(userName);
        if (user == null) return NotFound();
        _mapper.Map(memberUpdateDto, user);
        if (await _userRepository.SaveAllAsync()) return NoContent();
        return BadRequest("Failed to Upsate user");

    }

}
