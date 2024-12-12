sap.ui.define([], function() {
  const formatDate = (date) => {
    const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const suffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${suffix(day)} ${month} ${year}, ${date.toLocaleString(undefined, options)}`;
  };

  return { formatDate };
});
