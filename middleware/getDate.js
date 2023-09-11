// getDate

  // Function to convert a UTC timestamp to IST and format it
function convertToISTAndFormat(utcTimestamp) {
    // const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours and 30 minutes)
    const istTimestamp = utcTimestamp;
    const istDate = new Date(istTimestamp);
    
    // Format the date in a human-readable string
    const formattedDate = istDate.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata', // IST time zone
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    
    return formattedDate;
  }
  
// Export the current IST date
module.exports.getCurrentDate = () => {
    const currentUTC = Date.now();
    return convertToISTAndFormat(currentUTC);
};
  