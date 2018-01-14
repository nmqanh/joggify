class TimeEntryQuery
  def self.filter(page: nil, user: nil, is_date_ascending: nil, from_date: nil, to_date: nil)
    new(
      user: user,
      page: page,
      is_date_ascending: is_date_ascending,
      from_date: from_date,
      to_date: to_date
    ).filter
  end

  attr_reader :from_date, :to_date, :user, :is_date_ascending, :page

  def initialize(page:, user:, is_date_ascending:, from_date:, to_date:)
    @page              = page
    @from_date         = from_date
    @to_date           = to_date
    @user              = user
    @is_date_ascending = is_date_ascending
  end

  def filter
    result = TimeEntry
    if user.present?
      result = result.where(user: user)
    end

    if from_date.present?
      result = result.where(
        "date >= ?",
        convert_local_date_to_utc_time(from_date),
      )
    end

    if to_date.present?
      result = result.where(
        "date <= ?",
        convert_local_date_to_utc_time(to_date),
      )
    end

    unless is_date_ascending.nil?
      result = result.order(
        date: order_type,
        created_at: order_type
      )
    end

    if page.present?
      result = result.paginate(page: page)
    end

    result
  end

  private

    def convert_local_date_to_utc_time(date)
      Time.zone.parse(date).utc.to_s
    end

    def order_type
      is_date_ascending ? :asc : :desc
    end
end
