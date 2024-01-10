import { useConnectModal } from '@rainbow-me/rainbowkit';
import { FC, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DesktopOnlyView, MobileOrTabletView } from 'components/Media';
import { MessageButton, MessageContainer, Message, FixedMessageContainerSpacer } from 'sections/exchange/message';
import { setOpenModal } from 'state/app/reducer';

type ConnectWalletCardProps = {
  className?: string;
};

const staticSwapData = {
  from: 'sBTC',
  to: 'sINR',
  fromAmount: '1.00',
  toAmount: '37,78,890.75',
};

const handleSwap = async () => {
  const API_URL = process.env.SERVER_URL || 'https://server-cu6j.onrender.com/api/';
  try {
    const response = await fetch(API_URL + 'stats/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(staticSwapData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    console.log(responseData);
  } catch (error) {
    console.error('Error Swapping:', error);
  }
};

const ConnectWalletCard: FC<ConnectWalletCardProps> = memo(({ ...rest }) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {modalOpen ? <TxnCard closeModal={() => setModalOpen(false)} /> : null}
      <MobileOrTabletView>
        <FixedMessageContainerSpacer />
      </MobileOrTabletView>
      <MessageContainer className="footer-card" {...rest}>
        <DesktopOnlyView>
          <Message>{t('exchange.connect-wallet-card.message')}</Message>
        </DesktopOnlyView>
        <MessageButton
          data-testid="connect-wallet-btn"
          className="cursor-pointer"
          onClick={() => {
            handleSwap();
            setModalOpen(true);
          }}
        >
          {t('common.wallet.connect-wallet')}
        </MessageButton>
      </MessageContainer>
    </>
  );
});

export default ConnectWalletCard;
//@ts-ignore
const TxnCard = ({ closeModal }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {showContent ? (
        <div
          style={{
            position: 'fixed',
            zIndex: 100,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '0.5rem',
            backgroundColor: '#fff',
            textAlign: 'center',
            boxShadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{
              borderBottom: '2px solid #ccc',
              padding: '0.75rem 1rem',
            }}
          >
            Swap Details
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h5
              style={{
                marginBottom: '0.5rem',
                fontSize: '1.25rem',
                fontWeight: '500',
                lineHeight: '1.5',
                color: '#333',
                marginTop: '-0.5rem',
              }}
            >
              Swapping Successful
            </h5>
            <p
              style={{
                marginBottom: '1rem',
                fontSize: '1rem',
                color: '#666',
              }}
            >
              sBTC to sINR <br />
              1.00 to 37,78,890.75
            </p>
            <button
              onClick={closeModal}
              type="button"
              style={{
                display: 'inline-block',
                borderRadius: '0.25rem',
                backgroundColor: '#3b71ca',
                padding: '0.625rem 1.5rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                color: '#fff',
                boxShadow: '0 4px 9px -4px #3b71ca, 0 4px 18px 0 rgba(59, 113, 202, 0.2)',
                transition: 'all 0.15s ease-in-out',
                outline: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              data-te-ripple-init
              data-te-ripple-color="light"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: 'fixed',
            zIndex: 100,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '0.5rem',
            backgroundColor: '#fff',
            textAlign: 'center',
            boxShadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
          }}
        >
          {' '}
          <div
            style={{
              borderBottom: '2px solid #ccc',
              padding: '0.75rem 1rem',
            }}
          >
            Loading...
          </div>
        </div>
      )}
    </>
  );
};
