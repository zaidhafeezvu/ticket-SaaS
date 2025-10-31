-- AlterTable: Add performance indexes to Ticket table
-- Adds indexes for frequently queried fields: category, eventDate, and available

-- Create index on category field (used in WHERE clauses for filtering)
CREATE INDEX "Ticket_category_idx" ON "Ticket"("category");

-- Create index on eventDate field (used for sorting and filtering by date)
CREATE INDEX "Ticket_eventDate_idx" ON "Ticket"("eventDate");

-- Create index on available field (used for filtering available tickets)
CREATE INDEX "Ticket_available_idx" ON "Ticket"("available");

-- AlterTable: Add performance index to Purchase table
-- Adds index for status field used in filtering

-- Create index on status field (used for filtering by purchase status)
CREATE INDEX "Purchase_status_idx" ON "Purchase"("status");
