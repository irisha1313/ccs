const statusMap = {
  signedIn: {
    title: 'Signed In',
    secondaryTitle: 'IN',
    verb: 'Sign In',
    attributeName: 'signedIn',
  },
  excepted: {
    title: 'Excepted',
    secondaryTitle: 'Briefed',
    verb: 'Except',
    attributeName: 'excepted',
  },
  signedOut: {
    title: 'Out',
    verb: 'Sign Out',
    secondaryTitle: '',
    attributeName: 'signedOut',
  },
};

const removeOption = 'Remove';

export default {
  statusMap,
  removeOption,
};
