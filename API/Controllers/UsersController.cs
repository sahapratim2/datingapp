﻿using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;


[Authorize]
public class UsersController : BaseApiController
{
    private readonly DataContext _context;

    public UsersController(DataContext context)
    {
        _context = context;
    }
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return users;
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
    [HttpGet("{id}")]// api/users/2
    public async Task<ActionResult<AppUser>> GetUsers(int id)
    {
        return await _context.Users.FindAsync(id);
    }
/*
//without Async
    [HttpGet("{id}")]// api/users/2
    public ActionResult<AppUser> GetUsers1(int id)
    {
        return  _context.Users.Find(id);
    }
*/

}
