module Api
  module V1
    module DeviseTokenAuth
      class PasswordsController < ::DeviseTokenAuth::PasswordsController
        # this is where users arrive after visiting the password reset confirmation link
        # from email, hitting the frontend and then the frontend resending the token
        # along with the user inputted new password

        def update
          unless resource_params[:reset_password_token]
            # use standard devise update method if current_password is being used
            # otherwise use custom reset password flow
            return super
          end

          @resource = resource_class.with_reset_password_token(
            resource_params[:reset_password_token]
          )

          return render status: 400, json: { success: false, message: "Invalid reset token" } unless @resource

          # ensure that user is confirmed since token must be from email
          if @resource.devise_modules.include?(:confirmable) && !@resource.confirmed_at
            @resource.skip_confirmation!
          end

          # make sure account doesn't use oauth2 provider
          unless @resource.provider == "email"
            return render json: {
              success: false,
              message: "Password are not required to update"
            }
          end

          unless @resource.reset_password_period_valid?
            return render status: 400, json: { success: false, message: "Reset password token expired" }
          end

          # ensure that password params were sent
          unless password_resource_params[:password]
            return render status: 400, json: { success: false, message: "Missing password field" }
          end

          if @resource.update_attributes(password_resource_params)
            yield @resource if block_given?
            # does not authenticate user. User must still log in
            return render json: { success: true, message: "Password updated" }
          else
            return render status: 400, json: { success: false, message: "Failed to update password" }
          end
        end

        def reset
          user = User.find_by_email(params[:email])
          if user.present?
            user.send_reset_password_instructions
            render json: { success: true, message: "Reset password email sent!" }
          else
            render status: 400, json: { success: false, message: "Email does not exist" }
          end
        end
      end
    end
  end
end
