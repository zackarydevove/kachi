#!/usr/bin/env ts-node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const snapshot_service_1 = __importDefault(require("services/snapshot.service"));
function createSnapshots() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get date from command line arguments
        const dateArg = process.argv[2];
        // Get account IDs (everything after the date)
        const accountIds = process.argv[3]
            ? process.argv.slice(3).map((id) => parseInt(id))
            : [];
        if (!dateArg) {
            console.error('Usage: npm run create-snapshots <date> <accountId1> [accountId2] [accountId3] ...');
            console.error('Example: npm run create-snapshots 2025-08-17 1 2 5');
            process.exit(1);
        }
        // Validate account IDs are numbers
        if (accountIds.length > 0 && accountIds.some((id) => isNaN(id))) {
            console.error('All account IDs must be valid numbers');
            process.exit(1);
        }
        // Validate date format (yyyy-mm-dd)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateArg)) {
            console.error('Invalid date format. Please use yyyy-mm-dd format.');
            console.error('Example: 2025-08-17');
            process.exit(1);
        }
        try {
            const snapshotService = new snapshot_service_1.default();
            yield snapshotService.createTodaySnapshots(dateArg, accountIds !== null && accountIds !== void 0 ? accountIds : undefined);
        }
        catch (error) {
            console.error('Failed to create snapshots:', error);
            process.exit(1);
        }
    });
}
createSnapshots();
