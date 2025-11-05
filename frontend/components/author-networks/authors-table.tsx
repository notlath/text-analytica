"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AuthorData = {
  author: string;
  document: string;
  neighbors: string;
  centralityScore: string;
};

const data: AuthorData[] = [
  {
    author: "A, B, C",
    document: "An Empirical Analysis of Search in GSAT",
    neighbors: "D, E, F, G",
    centralityScore: "96.4%",
  },
  {
    author: "D, E, F",
    document:
      "Software Agents: Completing Patterns and Constructing User Interfaces",
    neighbors: "A, B, H, I",
    centralityScore: "85.2%",
  },
  {
    author: "G, H",
    document: "Machine Learning Applications in Natural Language Processing",
    neighbors: "C, D, J, K",
    centralityScore: "78.9%",
  },
  {
    author: "I, J, K",
    document: "Deep Neural Networks for Image Recognition",
    neighbors: "E, F, L, M",
    centralityScore: "92.1%",
  },
  {
    author: "L, M, N",
    document: "Reinforcement Learning in Autonomous Systems",
    neighbors: "G, H, O, P",
    centralityScore: "88.7%",
  },
];

const columns: ColumnDef<AuthorData>[] = [
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("author")}</div>
    ),
  },
  {
    accessorKey: "document",
    header: "Document",
    cell: ({ row }) => <div>{row.getValue("document")}</div>,
  },
  {
    accessorKey: "neighbors",
    header: "Neighbors",
    cell: ({ row }) => <div>{row.getValue("neighbors")}</div>,
  },
  {
    accessorKey: "centralityScore",
    header: () => <div className="text-right">Centrality Score</div>,
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("centralityScore")}</div>
    ),
  },
];

const AuthorsTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <article className="bg-card p-4 rounded-lg">
      <h2 className="mb-4 font-medium text-xl">Authors</h2>
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </article>
  );
};

export default AuthorsTable;
