import React from 'react';
import { render } from '@testing-library/react';
import LandingPage from './components/landing/LandingPage';
import NavBar from './components/chat/Navbar';
import Scoreboard from './components/chat/Scoreboard';
import RPS from './components/game-logic/RPS';

test('LandingPage renders login button', () => {
  const { getByText } = render(<LandingPage />);
  const element = getByText('Sign in with Google');
  expect(element).toBeInTheDocument();
});

let testUser = {
  email: "testemail@gmail.com",
  institution: "test institution",
  displayName: "Test User",
  photoURL: "https://lh6.googleusercontent.com/-X_t-tRI1CGc/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucntslJrh9B2H_pd3L4f_gxAZQTsEQ/photo.jpg",
  uuid: 'testuuid',
};
test('NavBar renders user properly', () => {
  const { getByText, get } = render(<NavBar user={testUser}/>);
  const element = getByText('Test');
  expect(element).toBeInTheDocument();
});

test('Scoreboard renders', () => {
  const { getByText, get } = render(<Scoreboard user={testUser}/>);
  const element = getByText('John Smith');
  const element2 = getByText('Jane Doe');
  expect(element).toBeInTheDocument();
  expect(element2).toBeInTheDocument();
});

test('RPS renders', () => {
  const { getByText, get } = render(<RPS />);
  const element = getByText('Rock');
  const element2 = getByText('Paper');
  const element3 = getByText('Scissors');
  const element4 = getByText("Lock In!");
  expect(element).toBeInTheDocument();
  expect(element2).toBeInTheDocument();
  expect(element3).toBeInTheDocument();
  expect(element4).toBeInTheDocument();
});

