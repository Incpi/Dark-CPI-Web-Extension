sap.ui.define([], function () {
  const formatDate = (date) => {
    const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
    const suffix = (d) => (d > 3 && d < 21 ? "th" : ["st", "nd", "rd"][(d % 10) - 1] || "th");
    return `${date.getDate()}${suffix(date.getDate())} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}, ${date.toLocaleString(undefined, options)}`;
  };
  // Helper function to format date to `YYYY-MM-DD HH:mm:ss`
  const formatDateTime = (dateinput) => {
    const [date, time] = dateinput.toLocaleString([], { hour12: false }).split(", ");
    return { date, time };
  };

  return { formatDate, formatDateTime };
});
