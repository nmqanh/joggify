class User < ActiveRecord::Base
  include PgSearch
  self.per_page = 8

  pg_search_scope :search_by_name_or_email, against: [:name, :email], using: {
    tsearch: {
      dictionary: "simple",
      prefix: true
    }
  }

  enum role: { user: 0, manager: 1, admin: 2 }

  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable

  after_initialize :set_default_role, if: :new_record?

  include DeviseTokenAuth::Concerns::User

  has_many :time_entries, dependent: :destroy

  validates_inclusion_of :timezone,
    in: ActiveSupport::TimeZone.all.map { |tz| tz.tzinfo.name }

  private
    def set_default_role
      self.role ||= :user
    end
end
