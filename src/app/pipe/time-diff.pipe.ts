import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDiff'
})
export class TimeDiffPipe implements PipeTransform {

  transform(timeout: any, timein?: any): any {
    if (timeout != null && timein != null) {

      // Timeout
      const timeoutDate = new Date(timeout); // some mock date
      const outMilliseconds = timeoutDate.getTime();

      // Time In
      const timeinDate = new Date(timein); // some mock date
      const inMilliseconds = timeinDate.getTime();

      const dateDiff = Math.abs(outMilliseconds - inMilliseconds);

      //  Get hours from milliseconds
      const hours = dateDiff / (1000 * 60 * 60);
      const absoluteHours = Math.floor(hours);
      const h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

      // Get remainder from hours and convert to minutes
      const minutes = (hours - absoluteHours) * 60;
      const absoluteMinutes = Math.floor(minutes);
      const m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

      // Get remainder from minutes and convert to seconds
      const seconds = (minutes - absoluteMinutes) * 60;
      const absoluteSeconds = Math.floor(seconds);
      const s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

      return (h + ':' + m + ':' + s);
    }
    else {
      return '';
    }
  }

}
