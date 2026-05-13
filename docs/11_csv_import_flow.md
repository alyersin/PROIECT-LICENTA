# CSV Import Flow

## 1. Overview

MaritimeOps uses CSV files for loading and discharge lists.

CSV import is part of the **Manage Vessel Visits** module.

The Terminal Operator uploads:

- discharge list
- loading list

The application reads the file with PapaParse, validates the rows manually, saves uploaded file information and creates vessel visit container records.

## 2. Library

The selected CSV library is:

```txt
PapaParse
```

Reasons:

- easy to understand
- simple API
- good support for headers
- suitable for beginner projects
- enough for licenta-level CSV import

## 3. Expected CSV structure

### Discharge list example

```csv
container_no,iso_type,size_ft,weight_kg,port,area_after,position_after
MSCU1234567,45G1,40,24000,ROCND,Import Yard,A1-01
TCLU7654321,22G1,20,18000,ROCND,Import Yard,A1-02
```

### Loading list example

```csv
container_no,iso_type,size_ft,weight_kg,port
MSCU9999999,45G1,40,22000,TRIST
TCLU8888888,22G1,20,16000,ITGOA
```

## 4. Required columns

### Required for discharge

```txt
container_no
operation inferred from file type: DISCHARGE
```

Recommended:

```txt
iso_type
size_ft
weight_kg
port
area_after
position_after
```

Allowed simplified areas:

```txt
Import Yard
Export Yard
Reefer Area
Empty Yard
ISO Tanks / IMDG Cargo Area
```

### Required for loading

```txt
container_no
operation inferred from file type: LOAD
```

Recommended:

```txt
iso_type
size_ft
weight_kg
port
```

## 5. Import flow

```txt
Terminal Operator opens vessel visit
↓
Selects Upload CSV
↓
Selects file type: DISCHARGE_LIST or LOADING_LIST
↓
Uploads CSV file
↓
System reads file with PapaParse
↓
System validates required columns and rows
↓
System displays preview
↓
Terminal Operator confirms import
↓
System saves uploaded_files record
↓
System creates vessel_visit_containers rows
↓
System creates or updates containers if needed
```

## 6. PapaParse example

```js
import Papa from "papaparse";

export function parseCsvText(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return {
    rows: result.data,
    errors: result.errors,
  };
}
```

## 7. Manual validation example

```js
export function validateCsvRows(rows) {
  const errors = [];

  rows.forEach((row, index) => {
    if (!row.container_no) {
      errors.push({
        row: index + 1,
        field: "container_no",
        message: "Container number is required",
      });
    }
  });

  return errors;
}
```

## 8. Discharge import logic

For each valid row:

1. Find container by `container_no`.
2. If not found, create container.
3. Create `vessel_visit_containers` row:
   - `operation_type = DISCHARGE`
   - `operation_status = planned`
4. Store weight, port, area and position if present.

Example inserted row:

```txt
id_vessel_visit: 1
id_container: 5
operation_type: DISCHARGE
operation_status: planned
port: ROCND
weight_kg: 24000
area_after: Import Yard
position_after: A1-01
```

## 9. Loading import logic

For each valid row:

1. Find container by `container_no`.
2. If not found, create container.
3. Create `vessel_visit_containers` row:
   - `operation_type = LOAD`
   - `operation_status = planned`
4. Store weight and port if present.

Example inserted row:

```txt
id_vessel_visit: 1
id_container: 7
operation_type: LOAD
operation_status: planned
port: TRIST
weight_kg: 22000
```

## 10. Uploaded file record

When a CSV is imported, the app inserts a row into `uploaded_files`.

Fields:

```txt
id_vessel_visit
id_uploaded_by
file_type
file_name
uploaded_at
```

## 11. Confirm discharge

After import, discharge operations are still planned.

When Terminal Operator confirms discharge:

1. `vessel_visit_containers.operation_status` becomes `confirmed`.
2. Container status is updated.
3. Container location is updated.
4. Container event is created.

Event:

```txt
event_type = DISCHARGED
event_area = selected discharge area
event_position = selected discharge position
```

## 12. Confirm loading

When Terminal Operator confirms loading:

1. `vessel_visit_containers.operation_status` becomes `confirmed`.
2. Container status is updated.
3. Container event is created.

Event:

```txt
event_type = LOADED
```

## 13. Common CSV validation errors

Examples:

```txt
Missing container number
Invalid container size
Invalid weight value
Invalid file type
Empty CSV file
Duplicate container number in same file
Invalid area after discharge
Invalid position after discharge
```

## 14. User feedback

The interface should show a preview before saving.

Example:

```txt
CSV parsed successfully.
20 rows found.
18 valid rows.
2 rows contain errors.
```

For errors:

```txt
Row 3: container_no is required.
Row 7: weight_kg must be numeric.
```

## 15. Simplicity decision

The system does not need to store the actual file on disk for the licenta version.

It is enough to store:

```txt
file name
file type
upload date
uploaded by
vessel visit
```

The parsed operational data is saved in `vessel_visit_containers`.


## 16. Relation with Manage Vessel Visits use case

CSV import is not a separate high-level actor use case in the final diagram. It is part of `Manage Vessel Visits`.

The Terminal Operator imports the loading/discharge lists received from the vessel agent or shipping line. MaritimeOps does not create the official stowage plan; it only imports operational lists and records terminal confirmations.
