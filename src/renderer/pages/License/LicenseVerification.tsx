import React, { useState, useEffect } from 'react';
import { FiShield, FiCheckCircle, FiXCircle, FiKey } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import './LicenseVerification.css';

interface LicenseVerificationProps {
  onVerified: () => void;
}

const LicenseVerification: React.FC<LicenseVerificationProps> = ({ onVerified }) => {
  const { t } = useLanguage();
  const [licenseKey, setLicenseKey] = useState('');
  const [hardwareId, setHardwareId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHardwareId();
  }, []);

  const loadHardwareId = async () => {
    try {
      if (window.electronAPI) {
        const id = await window.electronAPI.license.getHardwareId();
        setHardwareId(id);
      } else {
        setHardwareId('DEMO-HARDWARE-ID');
      }
    } catch (err) {
      console.error('Failed to load hardware ID:', err);
    }
  };

  const handleVerify = async () => {
    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.license.verify();
        if (result.valid) {
          onVerified();
        } else {
          setError(result.message || 'Invalid license key');
        }
      } else {
        // Demo mode - accept any key
        onVerified();
      }
    } catch (err) {
      setError('Failed to verify license. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.license.register(licenseKey);
        if (result.success) {
          onVerified();
        } else {
          setError('Failed to register license key');
        }
      } else {
        // Demo mode
        onVerified();
      }
    } catch (err) {
      setError('Failed to register license. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="license-verification">
      <div className="license-card">
        <div className="license-header">
          <div className="license-icon">
            <FiShield />
          </div>
          <h1 className="license-title">License Verification Required</h1>
          <p className="license-subtitle">
            Please enter your license key to continue using the POS System
          </p>
        </div>

        <div className="license-form">
          <div className="form-group">
            <label htmlFor="licenseKey" className="form-label">
              License Key
            </label>
            <div className="input-group">
              <FiKey className="input-icon" />
              <input
                id="licenseKey"
                type="text"
                className="input"
                placeholder="Enter your license key"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hardware ID</label>
            <div className="hardware-id-display">
              <code>{hardwareId}</code>
              <button
                className="btn btn-secondary btn-sm"
                onClick={loadHardwareId}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
            <p className="form-hint">
              This ID is unique to your hardware and is required for license activation
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <FiXCircle />
              <span>{error}</span>
            </div>
          )}

          <div className="license-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleRegister}
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Processing...' : 'Activate License'}
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={handleVerify}
              disabled={loading}
              style={{ flex: 1 }}
            >
              Verify Existing License
            </button>
          </div>

          <div className="license-footer">
            <p className="license-footer-text">
              Need help? Contact support at{' '}
              <a href="mailto:support@possystem.com">support@possystem.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseVerification;
