import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Main = styled.main`
  min-height: calc(100vh - 144px); /* 100vh - (header + footer) */
  padding: 2rem 0;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
      <Footer />
    </>
  );
};

export default MainLayout; 