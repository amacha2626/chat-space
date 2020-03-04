$(function(){

  function buildHTML(message){
    if (message.image){
      var html = `<div class="chat-main__message-list__message-container__message", data-message-id="${message.id}">
                    <div class="chat-main__message-list__message-container__message__message-upper">
                      <p class="chat-main__message-list__message-container__message__message-upper__name">
                        ${message.user_name}
                      </p>
                      <p class="chat-main__message-list__message-container__message__message-upper__update-time">
                        ${message.created_at}
                      </p>
                    </div>
                    <p class="chat-main__message-list__message-container__message__text">
                      ${message.content}<br>
                      <img src=${message.image}>
                    </p>
                  </div>`
                  return html;
    } else {
      var html = `<div class="chat-main__message-list__message-container__message", data-message-id="${message.id}">
                    <div class="chat-main__message-list__message-container__message__message-upper">
                      <p class="chat-main__message-list__message-container__message__message-upper__name">
                        ${message.user_name}
                      </p>
                      <p class="chat-main__message-list__message-container__message__message-upper__update-time">
                        ${message.created_at}
                      </p>
                    </div>
                    <p class="chat-main__message-list__message-container__message__text">
                        ${message.content}
                    </p>
                  </div>`
                  return html;
    };
  }

  $("#new_message").on('submit',function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__message-list__message-container').append(html);
      $('#new_message')[0].reset();
      $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      $('.chat-main__message-form__send').prop('disabled', false);
    })
    .fail(function(){
      alert("メッセージ送信に失敗しました");
      $('.chat-main__message-form__send').prop('disabled', false);
    })
  })

  var reloadMessages = function(){
    var last_message_id = $('.chat-main__message-list__message-container__message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: "get",
      dataType: "json",
      data: {id: last_message_id}
    })
    .done(function(messages){
      if (messages.length !== 0){
        var insertHTML = '';
        $.each(messages, function(i, message){
          insertHTML += buildHTML(message)
        });
        $(".chat-main__message-list__message-container").append(insertHTML);
        $(".chat-main__message-list").animate({ scrollTop: $(".chat-main__message-list__message-container")[0].scrollHeight });
      }
    })
    .fail(function(){
      alert("error");
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)){
    setInterval(reloadMessages, 7000);
  }
});