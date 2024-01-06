using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUnitOfWork _uow;

        public LikesController(IUnitOfWork uow)
        {
            _uow = uow;
        }
        [HttpPost("{username}")]
        public async Task<ActionResult> addLike(string userName){
            var sourceUserId = User.GetUserId();
            var likedUser = await _uow.UserRepository.GetUserByUserNameAsync(userName);
            var sourceUser = await _uow.LikesRepositiry.GetUserWithLikes(sourceUserId);

            if (likedUser == null) return NotFound();

            if (sourceUser.UserName == userName) return BadRequest("You cannot like yourself");

            var userLike = await _uow.LikesRepositiry.GetUserLike(sourceUserId, likedUser.Id);

            if (userLike != null) return BadRequest("You already like this user");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams){

            likesParams.UserId = User.GetUserId();

            var users = await _uow.LikesRepositiry.GetUserLikes(likesParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));

            return Ok(users);
        }
    }
}