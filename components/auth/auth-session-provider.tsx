type AuthSessionProviderProps = {
  children: React.ReactNode;
};

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  return <>{children}</>;
}
