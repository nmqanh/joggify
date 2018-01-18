class TimeEntryPolicy
  attr_reader :current_user, :time_entry

  def initialize(current_user, model)
    @current_user = current_user
    @time_entry = model
  end

  def create?
    current_user.admin? || time_entry.user == current_user
  end

  def update?
    current_user.admin? || time_entry.user == current_user
  end

  def destroy?
    current_user.admin? || time_entry.user == current_user
  end

  def permitted_filter_by_user_params
    if current_user.admin?
      [:user_id]
    else
      []
    end
  end

  class Scope
    attr_reader :current_user, :scope

    def initialize(current_user, scope)
      @current_user = current_user
      @scope = scope
    end

    def resolve
      if current_user.admin?
        scope.all
      else
        scope.where(user_id: current_user.id)
      end
    end
  end
end
