module Api::V1::TimeEntriesHelper
  private
    def target_user
      if filter_by_user_params[:user_id].present?
        find_user = User.where(id: filter_by_user_params[:user_id]).first
        find_user || current_user
      else
        current_user
      end
    end

    def filter_by_user_params
      params.permit(policy(TimeEntry).permitted_filter_by_user_params)
    end
end
