import { time } from "console";
import express from "express";
import moment from "moment";
import api from "./api";

const app = express();
const port = 8081;

app.get('/availability', (req, res) => {
  const datetime = req.query.datetime as string;
  const resourceId = req.query.resourceId as string;

  if ( !moment(datetime, 'YYYY-MM-DD HH:mm:ss', true) ) {
    res.status(400).json({ "error": "wrong format for param datetime" });
    return;
  }

  const date = datetime.split(' ')[1];

  api.getTimetables(date, resourceId).then(responseT => {

    if ( responseT.status == 404 ) {
      res.status(404).json({ "error": "resource not found" });
      return;
    }

    if ( !responseT.data.open ) {
      res.status(200).json({ "available": false });
      return;
    }

    const timetableOk = responseT.data.timetables.some(timetable => datetime >= timetable.opening && datetime < timetable.closing);
    if ( !timetableOk ) {
      res.status(200).json({ "available": false });
      return;
    }

    api.getReservations(date, resourceId).then(responseR => {
      const overrides = !responseR.data.reservations.some(reservation => datetime >= reservation.reservationStart && datetime < reservation.reservationEnd);
      if ( overrides ) {
        res.status(200).json({ "available": false });
        return;
      }

      res.status(200).json({"available": true});
    });
  });
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});