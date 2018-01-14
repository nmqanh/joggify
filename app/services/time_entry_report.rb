class TimeEntryReport
  def self.by_weeks(user: nil, from_date: nil, to_date: nil)
    new(
      user: user,
      from_date: from_date,
      to_date: to_date
    ).by_weeks
  end

  attr_reader :from_date, :to_date, :user, :query

  def initialize(user:, from_date:, to_date:)
    @from_date         = from_date
    @to_date           = to_date
    @user              = user
    @query             =
      TimeEntryQuery.filter(
        user: user,
        from_date: from_date,
        to_date: to_date
      )
  end

  def by_weeks
    Groupdate.week_start = :mon
    distance_arr = query.group_by_week(
      :date,
      time_zone: false
    ).sum(:distance_in_kilometres)

    duration_arr = query.group_by_week(
      :date,
      time_zone: false
    ).sum(:duration_in_minutes)

    distance_arr.map do |week_date, distance_in_kilometres|
      {
        week: "Week #{week_date.cweek} from #{week_date.strftime("%d/%m/%Y")}",
        distanceInKilometres: distance_in_kilometres,
        averageSpeedInKmph: duration_arr[week_date] == 0 ? 0 : (distance_in_kilometres * 60) / duration_arr[week_date]
      }
    end
  end
end
