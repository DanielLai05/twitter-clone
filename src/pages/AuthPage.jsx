import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithEmailAndPassword, signInWithPhoneNumber, signInWithPopup } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, Image, Modal, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';

export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1";

  const [modalShow, setModalShow] = useState(null);
  const [phoneNumberLoginModal, setphoneNumberLoginModal] = useState(false);
  const handleShowSignUp = () => setModalShow("SignUp");
  const handleShowLogin = () => setModalShow("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [varificationCode, setVarificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);


  useEffect(() => {
    if (currentUser) {
      navigate("/profile");
    }
  }, [currentUser, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      )
      console.log(res.user);
    } catch (error) {
      console.error(error);
    }
  }


  const handleSignUpWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error(error);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(auth, username, password);
      console.log(res);
      setError("");
    } catch (error) {
      setError("Invalid email or password");
      console.error(error.message);
    }
  }

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved:', response);
          },
        },

      );
    }
  };

  const sendVerificationCode = async () => {
    setError('');
    setMessage('');
    setupRecaptcha();

    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setConfirmationResult(result);
      setMessage('Verification code sent. Please check your phone.');
    } catch (err) {
      setError(err.message || 'Failed to send verifcation code.');

    }
  }

  const verifyCode = async () => {
    setError('');
    try {
      if (!confirmationResult) throw new Error('No confirmation result available.');
      await confirmationResult.confirm(varificationCode);
      setMessage('Phone login successful!');
      setphoneNumberLoginModal(false);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Failed to verify code.');
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };


  const handleClose = () => setModalShow(null);
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Row>
        <Col sm={6}>
          <Image src={loginImage} fluid />
        </Col>

        <Col sm={6} className="p-4">
          <i className='bi bi-twitter' style={{ fontSize: 50, color: "dodgerblue" }}></i>

          <p className='mt-5' style={{ fontSize: 64 }}>Happening Now</p>
          <h2 className='my-5' style={{ fontSize: 31 }}>Join Twitter Today.</h2>

          <Col sm={5} className='d-grid gap-2'>
            <Button className='rounded-pill' variant='outline-dark' onClick={handleSignUpWithGoogle}>
              <i className='bi bi-google'></i> Sign up with Google
            </Button>
            <Button className='rounded-pill' variant='outline-dark'>
              <i className='bi bi-apple'></i> Sign up with Apple
            </Button>
            <Button className='rounded-pill' variant='outline-dark'>
              <i className='bi bi-facebook'></i> Sign up with Facebook
            </Button>
            <p style={{ textAlign: 'center' }}>or</p>
            <Button
              className='rounded-pill'
              onClick={handleShowSignUp}
            >Create an account</Button>
            <p style={{ fontSize: "12px" }}>
              By signing up, you agree to the Terms of Service and Privacy Policy including Cookie Use
            </p>

            <p className='mt-5' style={{ fontWeight: 'bold' }}>
              Already have an account?
            </p>
            <Button
              className='rounded-pill'
              variant='outline-primary'
              onClick={handleShowLogin}
            >Sign In</Button>
            <Button
              className='rounded-pill'
              variant='outline-primary'
              onClick={() => setphoneNumberLoginModal(true)}
            >Sign In with Phone Number</Button>
          </Col>
          <Modal
            show={modalShow !== null}
            onHide={handleClose}
            centered
          >
            <Modal.Body >
              <h2 className='mb-4' style={{ fontWeight: "bold" }}>
                {
                  modalShow === 'SignUp' ?
                    "Create your account" :
                    "Log in to your account"
                }
              </h2>
              <Form
                className='d-gird gap-2 px-5'
                onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
              >
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Control
                    onChange={(e) => setUsername(e.target.value)}
                    type='email'
                    placeholder='Enter email'

                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Control
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    placeholder='Password'
                  />
                </Form.Group>
                {
                  error &&
                  <p className='text-danger'>{error}</p>
                }
                <p style={{ fontSize: "12px" }}>
                  By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use. SigmaTweets may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account seceure and personalising our services, including ads. Learn more. Others will be able to find you by email or phone number, when provided, unless you choose otherwise here.
                </p>
                <Button className='rounded-pill w-100' type='submit'>
                  {modalShow === 'SignUp' ? "Sign Up" : "Log in"}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
          <Modal
            show={phoneNumberLoginModal}
            onHide={() => {
              setphoneNumberLoginModal(false)
              setError('');
            }}
            centered
          >
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="w-100 text-center fw-bold fs-4">
                Login with Phone Number
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-4 pb-4">
              <Form className="d-flex flex-column gap-3">
                <Form.Group controlId="formPhoneNumber">
                  <Form.Label className="fw-semibold">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="+60123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Include your country code (e.g., +60 for Malaysia)
                  </Form.Text>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    className="rounded-pill"
                    onClick={sendVerificationCode}
                    disabled={!phoneNumber}
                  >
                    Send Verification Code
                  </Button>
                </div>

                {confirmationResult && (
                  <>
                    <hr />
                    <Form.Group controlId="formVerificationCode">
                      <Form.Label className="fw-semibold">Verification Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={varificationCode}
                        onChange={(e) => setVarificationCode(e.target.value)}
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button
                        variant="success"
                        className="rounded-pill"
                        onClick={verifyCode}
                      >
                        Verify & Login
                      </Button>
                    </div>
                  </>
                )}

                {error && (
                  <div className="alert alert-danger mt-3 py-2" role="alert">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="alert alert-success mt-3 py-2" role="alert">
                    {message}
                  </div>
                )}
              </Form>
              <div id="recaptcha-container" className="mt-3 text-center"></div>
            </Modal.Body>

            <Modal.Footer className="border-0 justify-content-center">
              <small className="text-muted">
                Having trouble? <a href="#" className="text-decoration-none">Contact support</a>
              </small>
            </Modal.Footer>
          </Modal>

        </Col>
      </Row>
    </div>
  );
}
