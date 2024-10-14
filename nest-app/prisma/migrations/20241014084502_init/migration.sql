-- CreateTable
CREATE TABLE "UserGroups" (
    "id" SERIAL NOT NULL,
    "userGroupName" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "loginId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userGroupId" INTEGER NOT NULL,
    "themeColor" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "userGroupId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "paymentDatetime" TIMESTAMP(3) NOT NULL,
    "paymentCategoryId" INTEGER NOT NULL,
    "paymentUserId" INTEGER NOT NULL,
    "loadRate" INTEGER NOT NULL,
    "isLiquidated" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_name_key" ON "Users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_loginId_key" ON "Users"("loginId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentCategories_name_key" ON "PaymentCategories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentCategories_color_key" ON "PaymentCategories"("color");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_userGroupId_fkey" FOREIGN KEY ("userGroupId") REFERENCES "UserGroups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentCategories" ADD CONSTRAINT "PaymentCategories_userGroupId_fkey" FOREIGN KEY ("userGroupId") REFERENCES "UserGroups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_paymentCategoryId_fkey" FOREIGN KEY ("paymentCategoryId") REFERENCES "PaymentCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_paymentUserId_fkey" FOREIGN KEY ("paymentUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
