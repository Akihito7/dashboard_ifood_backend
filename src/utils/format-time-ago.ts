export function formatTimeAgo(pastDateString: string) {
  const now = new Date();
  const pastDate = new Date(pastDateString);
  const timeDifferenceInMs = now.getTime() - pastDate.getTime();

  const secondsElapsed = Math.floor(timeDifferenceInMs / 1000);
  const minutesElapsed = Math.floor(secondsElapsed / 60);
  const hoursElapsed = Math.floor(minutesElapsed / 60);
  const daysElapsed = Math.floor(hoursElapsed / 24);

  let formattedTimeAgo;

  if (daysElapsed > 0) {
    formattedTimeAgo = `${daysElapsed} dias atrás`;
  } else if (hoursElapsed > 0) {
    formattedTimeAgo = `${hoursElapsed} horas atrás`;
  } else if (minutesElapsed > 0) {
    formattedTimeAgo = `${minutesElapsed} minutos atrás`;
  } else {
    formattedTimeAgo = `${secondsElapsed} segundos atrás`;
  }

  return `${formattedTimeAgo}`;
}
