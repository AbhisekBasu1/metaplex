import { useWallet, WalletMultiButton } from '@oyster/common';
import React from 'react';
import { CurrentUserBadge } from '../CurrentUserBadge';
import { HowToBuyModal } from '../HowToBuyModal';
import { Notifications } from '../Notifications';
import { Cog } from '../../components/CurrentUserBadge';

export const SecondaryMenu = () => {
  const { connected } = useWallet();

  return (
    <div className="secondary-menu">
      {connected ? (
        <>
          <Notifications buttonType="text" />
          <Cog buttonType="text" />
          <CurrentUserBadge showAddress={true} buttonType="text" />
        </>
      ) : (
        <>
          <HowToBuyModal buttonType="text" />
          <Cog buttonType="text" />
          <WalletMultiButton className="!bg-primary !rounded-full hover:!bg-primary-hover !text-color-text-accent" />
        </>
      )}
    </div>
  );
};
