const main = {
    init : function() {
        const _this = this;

        $('#btn-save').on('click', function () {
            _this.save();
        });

        $('#btn-update').on('click', function () {
            _this.update();
        });

        $('#btn-delete').on('click', function () {
            _this.delete();
        });


        $('#btn-user-modify').on('click', function () {
            _this.userModify();
        });


        $('#btn-comment-save').on('click', function () {
            _this.commentSave();
        });

        document.querySelectorAll('#btn-comment-update').forEach(function (item) {
            item.addEventListener('click', function () {
                const form = this.closest('form');
                _this.commentUpdate(form);
            });
        });
    },

    save : function () {
        const data = {
            title: $('#title').val(),
            writer: $('#writer').val(),
            content: $('#content').val()
        };

        if (!data.title || data.title.trim() === "" || !data.content || data.content.trim() === "") {
            alert("공백 또는 입력하지 않은 부분이 있습니다.");
            return false;
        } else {
            $.ajax({
                type: 'POST',
                url: '/api/posts',
                dataType: 'JSON',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data)
            }).done(function () {
                alert('등록되었습니다.');
                window.location.href = '/';
            }).fail(function (error) {
                alert(JSON.stringify(error));
            });
        }
    },


    update : function () {
        const data = {
            id: $('#id').val(),
            title: $('#title').val(),
            content: $('#content').val()
        };

        const con_check = confirm("수정하시겠습니까?");
        if (con_check === true) {
            if (!data.title || data.title.trim() === "" || !data.content || data.content.trim() === "") {
                alert("공백 또는 입력하지 않은 부분이 있습니다.");
                return false;
            } else {
                $.ajax({
                    type: 'PUT',
                    url: '/api/posts/' + data.id,
                    dataType: 'JSON',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(data)
                }).done(function () {
                    alert("수정되었습니다.");
                    window.location.href = '/posts/read/' + data.id;
                }).fail(function (error) {
                    alert(JSON.stringify(error));
                });
            }
        }
    },


    delete : function () {
        const id = $('#id').val();
        const con_check = confirm("정말 삭제하시겠습니까?");

        if(con_check == true) {
            $.ajax({
                type: 'DELETE',
                url: '/api/posts/'+id,
                dataType: 'JSON',
                contentType: 'application/json; charset=utf-8'

            }).done(function () {
                alert("삭제되었습니다.");
                window.location.href = '/';
            }).fail(function (error) {
                alert(JSON.stringify(error));
            });
        } else {
            return false;
        }
    },

    userModify : function () {
        const data = {
            id: $('#id').val(),
            modifiedDate: $('#modifiedDate').val(),
            username: $('#username').val(),
            nickname: $('#nickname').val(),
            password: $('#password').val()
        }
        if(!data.nickname || data.nickname.trim() === "" || !data.password || data.password.trim() === "") {
            alert("공백 또는 입력하지 않은 부분이 있습니다.");
            return false;
        } else if(!/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}/.test(data.password)) {
            alert("비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.");
            $('#password').focus();
            return false;
        } else if(!/^[ㄱ-ㅎ가-힣a-z0-9-_]{2,10}$/.test(data.nickname)) {
            alert("닉네임은 특수문자를 제외한 2~10자리여야 합니다.");
            $('#nickname').focus();
            return false;
        }
        const con_check = confirm("수정하시겠습니까?");
        if (con_check === true) {
            $.ajax({
                type: "PUT",
                url: "/api/user",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data)

            }).done(function () {
                alert("회원수정이 완료되었습니다.");
                window.location.href = "/";

            }).fail(function (error) {
                if (error.status === 500) {
                    alert("이미 사용중인 닉네임 입니다.");
                    $('#nickname').focus();
                } else {
                    alert(JSON.stringify(error));
                }
            });
        } else {
            return false;
        }
    },

    commentSave : function () {
        const data = {
            postsId: $('#postsId').val(),
            comment: $('#comment').val()
        }

        if (!data.comment || data.comment.trim() === "") {
            alert("공백 또는 입력하지 않은 부분이 있습니다.");
            return false;
        } else {
            $.ajax({
                type: 'POST',
                url: '/api/posts/' + data.postsId + '/comments',
                dataType: 'JSON',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data)
            }).done(function () {
                alert('댓글이 등록되었습니다.');
                window.location.reload();
            }).fail(function (error) {
                alert(JSON.stringify(error));
            });
        }
    },

    commentUpdate : function (form) {
        const data = {
            id: form.querySelector('#id').value,
            postsId: form.querySelector('#postsId').value,
            comment: form.querySelector('#comment-content').value,
            writerUserId: form.querySelector('#writerUserId').value,
            sessionUserId: form.querySelector('#sessionUserId').value
        }
        console.log("commentWriterID : " + data.writerUserId);
        console.log("sessionUserID : " + data.sessionUserId);

        if (data.writerUserId !== data.sessionUserId) {
            alert("본인이 작성한 댓글만 수정 가능합니다.");
            return false;
        }

        if (!data.comment || data.comment.trim() === "") {
            alert("공백 또는 입력하지 않은 부분이 있습니다.");
            return false;
        }
        const con_check = confirm("수정하시겠습니까?");
        if (con_check === true) {
            $.ajax({
                type: 'PUT',
                url: '/api/posts/' + data.postsId + '/comments/' + data.id,
                dataType: 'JSON',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data)
            }).done(function () {
                window.location.reload();
            }).fail(function (error) {
                alert(JSON.stringify(error));
            });
        }
    },

    commentDelete : function (postsId, commentId, commentWriterId, sessionUserId) {

        if (commentWriterId !== sessionUserId) {
            alert("본인이 작성한 댓글만 삭제 가능합니다.");
        } else {
            const con_check = confirm("삭제하시겠습니까?");

            if (con_check === true) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/posts/' + postsId + '/comments/' + commentId,
                    dataType: 'JSON',
                }).done(function () {
                    alert('댓글이 삭제되었습니다.');
                    window.location.reload();
                }).fail(function (error) {
                    alert(JSON.stringify(error));
                });
            }
        }
    }
};

main.init();