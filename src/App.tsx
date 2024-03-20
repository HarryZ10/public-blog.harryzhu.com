import React from 'react'; // Import React (though it's optional in newer versions of React with the new JSX Transform)
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import GlobalStyle from './styles/globalStyles';
import theme from './styles/themes';
import Routes from './routes';
import 'bootstrap/dist/css/bootstrap.css';

const App: React.FC = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <GlobalStyle />
      <Routes />
    </ThemeProvider>
  );
};

export default App;
