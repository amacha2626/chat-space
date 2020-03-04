class MessagesController < ApplicationController
before_action :set_group

  def index
    unless user_signed_in?
      redirect_to new_user_session_path
    end
    
    @users = @group.users
    @message = Message.new
    @messages = @group.messages.includes(:user)
  end

  def create
    @message = @group.messages.new(message_params)
    if @message.save
      respond_to do |format|
        format.json

      end
    else
      @messages = @group.messages.includes(:user)
      flash.now[:alert] = 'メッセージを入力してください'
      redirect_to group_messages_path(@group)
    end
  end

  private
  def message_params
    params.require(:message).permit(:content, :image).merge(user_id: current_user.id, group_id: params[:group_id])
  end

  def set_group
    @group = Group.find(params[:group_id])
  end
end
