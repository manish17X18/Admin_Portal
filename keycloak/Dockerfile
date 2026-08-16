FROM quay.io/keycloak/keycloak:latest

ENV KC_HTTP_ENABLED=true
ENV KC_HTTP_PORT=8080
ENV KC_HOSTNAME_STRICT=false

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

CMD ["start-dev"]