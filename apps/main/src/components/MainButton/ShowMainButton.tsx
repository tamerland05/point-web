/* eslint-disable react-hooks/exhaustive-deps */

import { memo, useEffect } from "react";

import { useSetAtom } from "jotai";

import { mainButtonAtom, secondaryButtonAtom } from "@/atoms/ui";

interface ButtonProps {
  onClick?: () => void;
  hidden?: boolean;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
}

export interface ShowMainButtonProps extends ButtonProps {
  children?: React.ReactNode;
  secondary?: ButtonProps;
}

export const ShowMainButton: React.FC<ShowMainButtonProps> = memo(
  ({ onClick, loading, disabled, title, hidden, secondary, children }) => {
    const setMainButton = useSetAtom(mainButtonAtom);
    const setSecondaryButton = useSetAtom(secondaryButtonAtom);

    useEffect(() => {
      setMainButton({ onClick, loading, disabled, title, hidden });
      if (secondary) {
        setSecondaryButton(secondary);
      }
      return () => {
        setMainButton({});
        setSecondaryButton({});
      };
    }, [onClick, loading, disabled, title, hidden, secondary]);

    return children;
  },
);

ShowMainButton.displayName = "ShowMainButton";
