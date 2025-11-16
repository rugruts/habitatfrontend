-- Fix availability check function
-- This function checks if a property is available for the given dates

CREATE OR REPLACE FUNCTION check_property_availability(
  check_in_date DATE,
  check_out_date DATE,
  property_uuid UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  conflicting_bookings INTEGER;
BEGIN
  -- Check for conflicting bookings
  SELECT COUNT(*)
  INTO conflicting_bookings
  FROM bookings
  WHERE property_id = property_uuid
    AND status IN ('confirmed', 'paid', 'pending')
    AND (
      (check_in <= check_in_date AND check_out > check_in_date) OR
      (check_in < check_out_date AND check_out >= check_out_date) OR
      (check_in >= check_in_date AND check_out <= check_out_date)
    );

  -- Return true if no conflicting bookings found
  RETURN conflicting_bookings = 0;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_property_availability(DATE, DATE, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION check_property_availability(DATE, DATE, UUID) TO service_role;
