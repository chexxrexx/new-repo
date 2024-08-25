import React from 'react';
import Image from "next/image";
import logo from '../public/logo.png';

const Certificate = () => {
  // Define the styles in a React-compatible way
  const styles = {
    container: {
      width: '210mm',
      height: '210mm',
      display: 'flex',
      top: '50%',           // Position from the top
      left: '50%',          // Position from the left
      transform: 'translate(-50%, -50%)', // Centering the element
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0', // Light gray shade
    },
    content: {
      width: '80%',
      height: '80%',
      padding: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
      <Image className=" object-cover rounded-lg"
              fill
              priority
              src={logo}
              alt="form-learn"/>
        <h1>Hello, A4 World!</h1>
        <p>This is an exam.</p>
      </div>
    </div>
  );
};

export default Certificate;
