class UserPolicy
  attr_reader :current_user, :user

  def initialize(current_user, model)
    @current_user = current_user
    @user = model
  end

  def index?
    current_user.admin? || current_user.manager?
  end

  def search?
    current_user.admin? || current_user.manager?
  end

  def create?
    current_user.admin? || current_user.manager?
  end

  def update?
    (current_user.admin?) ||
    (current_user.manager? && !user.admin?) ||
    (current_user == user)
  end

  def destroy?
    return false if current_user == user
    (current_user.admin?) ||
    (current_user.manager? && !user.admin?)
  end
end
