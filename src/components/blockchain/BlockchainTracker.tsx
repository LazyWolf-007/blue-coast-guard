import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Coins,
  Shield,
  Clock,
  CheckCircle,
  Hash,
  TrendingUp,
  Copy,
  ExternalLink,
  Eye
} from "lucide-react";

interface Transaction {
  id: string;
  hash: string;
  type: "verification" | "credit_issued" | "project_created";
  amount?: number;
  projectName: string;
  timestamp: string;
  status: "pending" | "confirmed" | "failed";
  blockNumber: number;
  gasUsed: string;
}

interface CarbonCredit {
  id: string;
  tokenId: string;
  amount: number;
  projectName: string;
  verificationStatus: "verified" | "pending" | "rejected";
  issuedDate: string;
  expiryDate: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    hash: "0x742d35cc6cb8c532c2e2d2e2b39f4c6f73d2d6b2b7c2c4c5c6c7c8c9c0c1c2c3",
    type: "credit_issued",
    amount: 23.4,
    projectName: "Sundarbans Mangrove Revival",
    timestamp: "2024-12-15T10:30:45Z",
    status: "confirmed",
    blockNumber: 18459672,
    gasUsed: "0.0021"
  },
  {
    id: "2",
    hash: "0x8b5f2a9c1e4d7f3a8c6b2e9d5f1a7c4b8e2d6f9a3c7b5e8d1f4a7c2b6e9d3f8a",
    type: "verification",
    projectName: "Pichavaram Restoration",
    timestamp: "2024-12-15T09:15:22Z",
    status: "confirmed",
    blockNumber: 18459653,
    gasUsed: "0.0018"
  },
  {
    id: "3",
    hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f",
    type: "project_created",
    projectName: "Bhitarkanika Conservation",
    timestamp: "2024-12-15T08:45:10Z",
    status: "pending",
    blockNumber: 18459641,
    gasUsed: "0.0024"
  }
];

const mockCredits: CarbonCredit[] = [
  {
    id: "1",
    tokenId: "BCC-001-2024-001",
    amount: 23.4,
    projectName: "Sundarbans Mangrove Revival",
    verificationStatus: "verified",
    issuedDate: "2024-12-15",
    expiryDate: "2027-12-15"
  },
  {
    id: "2",
    tokenId: "BCC-001-2024-002",
    amount: 45.8,
    projectName: "Pichavaram Restoration",
    verificationStatus: "verified",
    issuedDate: "2024-12-10",
    expiryDate: "2027-12-10"
  },
  {
    id: "3",
    tokenId: "BCC-001-2024-003",
    amount: 12.6,
    projectName: "Bhitarkanika Conservation",
    verificationStatus: "pending",
    issuedDate: "2024-12-14",
    expiryDate: "2027-12-14"
  }
];

const BlockchainTracker = () => {
  const [activeTab, setActiveTab] = useState<"transactions" | "credits">("transactions");

  const getTransactionTypeIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "verification": return Shield;
      case "credit_issued": return Coins;
      case "project_created": return TrendingUp;
      default: return Hash;
    }
  };

  const getTransactionTypeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "verification": return "text-primary";
      case "credit_issued": return "text-secondary";
      case "project_created": return "text-accent";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": case "verified": return "bg-secondary text-secondary-foreground";
      case "pending": return "bg-accent text-accent-foreground";
      case "failed": case "rejected": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Blockchain Tracker</h2>
          <p className="text-muted-foreground">
            Transparent verification and carbon credit management on the blockchain
          </p>
        </div>
        
        {/* Wallet Info */}
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ocean-gradient rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium">Connected Wallet</div>
                <div className="text-xs text-muted-foreground font-mono">
                  0x742d...c2c3
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group hover:shadow-gentle transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Carbon Credits</p>
                <p className="text-2xl font-bold text-secondary">81.8 tons</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10">
                <Coins className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-gentle transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified Projects</p>
                <p className="text-2xl font-bold text-primary">127</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-gentle transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network Gas Saved</p>
                <p className="text-2xl font-bold text-accent">0.0472 ETH</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "transactions" ? "default" : "outline"}
          onClick={() => setActiveTab("transactions")}
          className="gap-2"
        >
          <Hash className="h-4 w-4" />
          Transactions
        </Button>
        <Button
          variant={activeTab === "credits" ? "default" : "outline"}
          onClick={() => setActiveTab("credits")}
          className="gap-2"
        >
          <Coins className="h-4 w-4" />
          Carbon Credits
        </Button>
      </div>

      {/* Content */}
      {activeTab === "transactions" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map((transaction) => {
                const TypeIcon = getTransactionTypeIcon(transaction.type);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg bg-muted ${getTransactionTypeColor(transaction.type)}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">
                            {transaction.type.replace("_", " ")}
                          </span>
                          {transaction.amount && (
                            <Badge variant="secondary" className="text-xs">
                              +{transaction.amount} credits
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{transaction.projectName}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {formatHash(transaction.hash)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(transaction.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(transaction.status)} variant="secondary">
                        {transaction.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(transaction.hash)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Your Carbon Credits (ERC-1155 Tokens)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCredits.map((credit) => (
                <Card key={credit.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-mono text-sm text-muted-foreground">
                            Token ID: {credit.tokenId}
                          </div>
                          <div className="text-2xl font-bold text-secondary mt-1">
                            {credit.amount} tons CO₂
                          </div>
                        </div>
                        <Badge className={getStatusColor(credit.verificationStatus)} variant="secondary">
                          {credit.verificationStatus}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="font-medium">{credit.projectName}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Issued: {credit.issuedDate}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expires: {credit.expiryDate}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Trade
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlockchainTracker;