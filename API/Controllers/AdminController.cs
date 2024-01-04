
using System.Runtime.Intrinsics.Arm;
using API.Entities;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;

        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [Authorize(Policy="RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles(){

            var users = await _userManager.Users
                             .OrderBy(u => u.UserName)
                             .Select(u => new
                             {
                                 u.Id,
                                 UserName = u.UserName,
                                 Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                             }).ToListAsync();
            return Ok(users);             
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string userName, [FromQuery]string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");
            
            var seletedRoles = roles.Split(",").ToArray();
            
            var user = await _userManager.FindByNameAsync(userName);
            
            if (user == null) return NotFound();
            
            var userRoles = await _userManager.GetRolesAsync(user);
            
            var result = await _userManager.AddToRolesAsync(user, seletedRoles.Except(userRoles));
            
            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(seletedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await _userManager.GetRolesAsync(user));

        }

        [Authorize(Policy = "ModeratePhotoRoles")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration(){
            return Ok("Admins or midetators can see this");
        }
        
    }
}