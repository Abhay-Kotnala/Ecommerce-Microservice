import { AuthProvider } from "react-oidc-context";
import { ReactNode } from "react";

const oidcConfig = {
  authority: import.meta.env.VITE_KEYCLOAK_URL + "/realms/" + import.meta.env.VITE_KEYCLOAK_REALM,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
};

export const KeycloakProvider = ({ children }: { children: ReactNode }) => {
  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
};
