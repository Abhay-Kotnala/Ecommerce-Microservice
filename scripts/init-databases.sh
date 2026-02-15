#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE orderdb;
    CREATE DATABASE inventorydb;
    CREATE DATABASE keycloakdb;
    CREATE DATABASE paymentdb;
    GRANT ALL PRIVILEGES ON DATABASE orderdb TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE inventorydb TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE keycloakdb TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE paymentdb TO postgres;
EOSQL
