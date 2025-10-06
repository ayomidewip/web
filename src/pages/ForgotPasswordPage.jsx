import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useNotification } from '@contexts/NotificationContext';
import {
    Page,
    Container,
    Card,
    Input,
    Button,
    Typography,
    Icon
} from '@components/Components';

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword } = useAuth();
    const { error: showError, success: showSuccess } = useNotification();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Simple validation - just check if email is provided
        if (!email) {
            showError('Please enter your email address');
            return;
        }
        
        setIsLoading(true);

        try {
            const result = await forgotPassword(email);
            
            if (result.success) {
                setIsSubmitted(true);
                showSuccess('Password reset instructions have been sent to your email.');
            } else {
                showError(result.error || 'Failed to send reset instructions. Please try again.');
            }
        } catch (error) {
            showError(error.message || 'Failed to send reset instructions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <Page>
                <Container layout="flex" align="center" justify="center" style={{ minHeight: '100vh' }}>
                    <Card style={{ maxWidth: '400px', width: '100%' }}>
                        <Container layout="flex-column" gap="lg" justify="center">
                            <Icon name="FaCheckCircle" size="lg" variant="success"/>
                            <Typography as="h1" size="2xl" weight="bold" color="primary">
                                Check Your Email
                            </Typography>
                            <Typography color="muted" align="center">
                                We've sent password reset instructions to <strong>{email}</strong>
                            </Typography>
                            <Typography color="muted" align="center" size="sm">
                                Please check your email and click the reset link to continue.
                            </Typography>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/login')}
                                width="100%"
                            >
                                <Icon name="FaArrowLeft"/>
                                Back to Sign In
                            </Button>
                        </Container>
                    </Card>
                </Container>
            </Page>
        );
    }

    return (
        <Page>
            <Container layout="flex" align="center" justify="center" style={{ minHeight: '100vh' }}>
                <Card style={{ maxWidth: '400px', width: '100%' }}>
                    <Container layout="flex-column" gap="lg" align="center">
                        {/* Header */}
                        <Container layout="flex-column" gap="sm" align="center" justify="center" padding="none">
                            <Icon name="FaKey" size="lg" variant="primary"/>
                            <Typography as="h1" size="2xl" weight="bold" color="primary">
                                Forgot Password?
                            </Typography>
                            <Typography color="muted">
                                No worries! Enter your email address and we'll send you reset instructions.
                            </Typography>
                        </Container>

                        {/* Form */}
                        <Container layout="flex-column" gap="md" width="100%">
                            <Input
                                type="email"
                                name="email"
                                label="Email Address"
                                variant="floating"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                width="100%"
                                icon="FaEnvelope"
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="large"
                                disabled={!email || isLoading}
                                onClick={handleSubmit}
                                width="100%"
                            >
                                {isLoading ? (
                                    <>
                                        <Icon name="FaSpinner"/>
                                        Sending Instructions...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="FaPaperPlane"/>
                                        Send Reset Instructions
                                    </>
                                )}
                            </Button>
                        </Container>
                        {/* Back to Login */}
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => navigate('/login')}
                        >
                            <Icon name="FaArrowLeft"/>
                            Back to Sign In
                        </Button>
                    </Container>
                </Card>
            </Container>
        </Page>
    );
};

export default ForgotPasswordPage;
