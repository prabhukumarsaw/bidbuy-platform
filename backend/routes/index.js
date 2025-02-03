const express = require('express');
const authRoutes = require('./v1/auth-routes');
const sellerRoutes = require('./seller/seller-routes');
const adminRoutes = require('./admin/admin-routes');
const categoryRoutes = require('./v1/category-routes');
const auctionRoutes = require('./v1/auction.routes');
const adminAuction = require('./admin/admin-auction');
const sellerAuction = require('./seller/seller-auction');
const userRoutes = require('./v1/user-routes');
// const notificationRoutes = require('./v1/notification.routes');

const router = express.Router();

/*---------------------------------------------------------------------- */
/*------------------------authentication routes------------------------ */
/*---------------------------------------------------------------------- */

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/seller', sellerRoutes);
router.use('/admin', adminRoutes);

/*---------------------------------------------------------------------- */
/*------------------------Category routes------------------------------- */
/*---------------------------------------------------------------------- */

router.use('/categories', categoryRoutes);

/*---------------------------------------------------------------------- */
/*-------------------------Auction routes------------------------------- */
/*---------------------------------------------------------------------- */
router.use('/auctions', auctionRoutes);
router.use('/admin-auctions', adminAuction);
router.use('/seller-auctions', sellerAuction);

/*---------------------------------------------------------------------- */
/*------------------------notifications routes-------------------------- */
/*---------------------------------------------------------------------- */
// router.use('/notifications', notificationRoutes);

module.exports = router;
