package com.jvision.board.infrastructure.persistence;

import com.jvision.board.domain.Comment;
import com.jvision.board.domain.Posts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> getCommentByPostsOrderById(Posts posts);
}
