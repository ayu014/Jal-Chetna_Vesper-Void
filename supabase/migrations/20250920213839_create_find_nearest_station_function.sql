-- This function finds the SINGLE nearest station (for AI and Forecasts)
CREATE OR REPLACE FUNCTION find_nearest_station(lat float, lon float)
RETURNS SETOF live_station_data AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.live_station_data
  ORDER BY
    (
      6371 * acos(
        cos(radians(lat)) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(lon)) +
        sin(radians(lat)) * sin(radians(latitude))
      )
    )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- This function finds the 3 nearest stations (for the "Nearest Station" UI component)
CREATE OR REPLACE FUNCTION find_nearby_stations(lat float, lon float)
RETURNS SETOF live_station_data AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.live_station_data
  ORDER BY
    (
      6371 * acos(
        cos(radians(lat)) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(lon)) +
        sin(radians(lat)) * sin(radians(latitude))
      )
    )
  LIMIT 3;
END;
$$ LANGUAGE plpgsql;