FROM quay.io/keycloak/keycloak:latest

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

CMD ["start", "--http-enabled=true", "--proxy-headers=xforwarded"]