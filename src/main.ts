import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
const session = require('express-session');
const Keycloak = require('keycloak-connect');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const memoryStore = new session.MemoryStore();
  app.use(session({
    secret: 'otro-secreto-para-sistema-b',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  }));

  const keycloak = new Keycloak({ store: memoryStore }, {
    realm: process.env.KEYCLOAK_REALM,
    'auth-server-url': process.env.KEYCLOAK_AUTH_SERVER_URL,
    resource: process.env.KEYCLOAK_CLIENT_ID,
    credentials: {
      secret: process.env.KEYCLOAK_CLIENT_SECRET,
    },
    'confidential-port': 0,
  });

  app.use(keycloak.middleware({ logout: '/logout', admin: '/' }));

  // AUTENTICACIÓN: cualquiera que entre a /rutas debe estar logueado
  app.use('/rutas', keycloak.protect());

  // AUTORIZACIÓN: solo quien tenga el rol "operador_transporte" puede
  // registrar rutas nuevas (POST); ver el listado (GET) basta con estar logueado
  app.use('/rutas', (req, res, next) => {
    if (req.method === 'POST') {
      return keycloak.protect('realm:operador_transporte')(req, res, next);
    }
    next();
  });

  // El endpoint que consume Sistema A NO debe protegerse con Keycloak:
  // A y B se autentican entre sí con la trama KMS, no con sesión de navegador
  await app.listen(3001);
}
bootstrap();