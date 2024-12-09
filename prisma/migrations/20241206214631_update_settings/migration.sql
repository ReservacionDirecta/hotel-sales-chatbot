-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "language" TEXT NOT NULL DEFAULT 'es',
    "timeZone" TEXT NOT NULL DEFAULT 'America/Lima',
    "welcomeMessage" TEXT NOT NULL DEFAULT '¡Bienvenido! ¿En qué puedo ayudarte?',
    "businessName" TEXT NOT NULL DEFAULT '',
    "businessHours" TEXT NOT NULL DEFAULT '09:00-18:00',
    "notificationEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("createdAt", "currency", "id", "updatedAt") SELECT "createdAt", "currency", "id", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
