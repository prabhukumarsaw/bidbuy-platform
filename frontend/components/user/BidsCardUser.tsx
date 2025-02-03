import { useEffect, useState } from 'react';
import { userApi } from '@/lib/api/userApi'; // Import userApi
import { Bid, BidStatus } from '@/types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react'; // Optional, for a spinner

const BidsTable = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [sortBy, setSortBy] = useState<'currentPrice' | 'bidTime'>(
    'currentPrice'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const bidData = await userApi.getUserBids(); // Fetch the bids
        setBids(bidData.data); // Set the fetched bids in state
      } catch (error) {
        setError('Failed to load bids. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []); // Fetch bids once when the component mounts

  // Sorting Logic
  const sortedBids = bids.sort((a, b) => {
    const aValue =
      sortBy === 'currentPrice'
        ? a.auction?.currentPrice
        : new Date(a.bidHistory?.bidTime);
    const bValue =
      sortBy === 'currentPrice'
        ? b.auction?.currentPrice
        : new Date(b.bidHistory?.bidTime);

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (field: 'currentPrice' | 'bidTime') => {
    setSortBy(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-white mb-6">Your Bids Overview</h2>

      {loading && (
        <div className="flex justify-center items-center mb-6">
          <Loader2 className="animate-spin h-8 w-8 text-white" />
          <span className="ml-2 text-lg text-white">Loading bids...</span>
        </div>
      )}
      {error && <p className="text-xl text-red-500">{error}</p>}

      {/* ShadCN Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('currentPrice')}
                  className="flex items-center"
                >
                  Current Price
                  {sortBy === 'currentPrice' && (
                    <span
                      className={`ml-2 text-sm ${
                        sortOrder === 'asc' ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  )}
                </button>
              </TableHead>
              <TableHead className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('bidTime')}
                  className="flex items-center"
                >
                  Bid Time
                  {sortBy === 'bidTime' && (
                    <span
                      className={`ml-2 text-sm ${
                        sortOrder === 'asc' ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  )}
                </button>
              </TableHead>
              <TableHead className="px-6 py-3 text-left">Auction</TableHead>
              <TableHead className="px-6 py-3 text-left">
                Previous Price
              </TableHead>
              <TableHead className="px-6 py-3 text-left">Auction End</TableHead>
              <TableHead className="px-6 py-3 text-left">Status</TableHead>
              <TableHead className="px-6 py-3 text-left">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedBids.length > 0 ? (
              sortedBids.map((bid) => (
                <TableRow
                  key={bid.id}
                  className="hover:blur-none hover:rounded-lg  transition-colors"
                >
                  <TableCell className="px-6 py-4 text-sm">
                    ${bid.auction?.currentPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {new Date(bid.bidHistory?.bidTime).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {bid.auction?.title}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    ${bid.bidHistory?.previousPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {new Date(bid.auction?.endTime).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    <span
                      className={`${
                        bid.status === BidStatus.WINNING
                          ? 'bg-green-500 text-white'
                          : bid.status === BidStatus.OUTBID
                          ? 'bg-yellow-500 text-black'
                          : bid.status === BidStatus.LOST
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-500 text-white'
                      } px-3 py-1 text-xs font-bold rounded-full`}
                    >
                      {BidStatus[bid.status]}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    <a
                      href={`/auction/${bid.auction.id}`}
                      className="text-blue-300 hover:text-blue-400 font-semibold"
                    >
                      View Auction
                    </a>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No bids placed yet!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BidsTable;
