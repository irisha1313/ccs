const timeValuesMap = {
  '1 minute': '00:01:00',
  Immediately: '00:01:00',
  '5 minutes': '00:05:00',
  '10 minutes': '00:10:00',
  '15 minutes': '00:15:00',
  '20 minutes': '00:20:00',
  '25 minutes': '00:25:00',
  '30 minutes': '00:30:00',
  '35 minutes': '00:35:00',
  '40 minutes': '00:40:00',
  '45 minutes': '00:45:00',
  '50 minutes': '00:50:00',
  '55 minutes': '00:55:00',
  '1 hour': '01:00:00',
  '1:15 hours': '01:15:00',
  '1:30 hours': '01:30:00',
  '1:45 hours': '01:45:00',
  '2 hours': '02:00:00',
};

export const timeSelectionSanitizer = (newValue) =>
  newValue !== 'Off' ? timeValuesMap[newValue] : newValue;
