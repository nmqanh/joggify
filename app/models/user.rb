class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable

  has_many :time_entries, dependent: :destroy

  validates_inclusion_of :timezone,
    in: ActiveSupport::TimeZone.all.map { |tz| tz.tzinfo.name }

  include DeviseTokenAuth::Concerns::User
end
