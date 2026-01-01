# 🛡️ **DRAFT PERSISTENCE IMPLEMENTATION GUIDE**

## **Changes Required for Admissions.tsx**

---

### **Step 1: Add Draft Load Hook (Insert after line 105)**

```typescript
  //TASK 1: Load Draft on Component Mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(ADMISSION_DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setStudentName(draft.studentName || "");
        setFatherName(draft.fatherName || "");
        setSelectedClassId(draft.selectedClassId || "");
        setSelectedSessionId(draft.selectedSessionId || "");
        setGroup(draft.group || "");
        setSelectedSubjects(draft.selectedSubjects || []);
        setParentCell(draft.parentCell || "");
        setStudentCell(draft.studentCell || "");
        setAddress(draft.address || "");
        setAdmissionDate(draft.admissionDate || new Date().toISOString().split("T")[0]);
        setTotalFee(draft.totalFee || "");
        setPaidAmount(draft.paidAmount || "");
        setIsCustomFeeMode(draft.isCustomFeeMode || false);
        console.log('✅ Draft loaded from localStorage');
      } catch (error) {
        console.error('❌ Error loading draft:', error);
      }
    }
  }, []);

  // TASK 1: Save Draft to localStorage whenever form state changes
  useEffect(() => {
    // Skip if form is completely empty
    if (!studentName && !fatherName && !selectedClassId && !parentCell) {
      return;
    }

    const draft = {
      studentName,
      fatherName,
      selectedClassId,
      selectedSessionId,
      group,
      selectedSubjects,
      parentCell,
      studentCell,
      address,
      admissionDate,
      totalFee,
      paidAmount,
      isCustomFeeMode,
    };

    localStorage.setItem(ADMISSION_DRAFT_KEY, JSON.stringify(draft));
    setDraftSaved(true);

    // Hide "Draft saved" indicator after 2 seconds
    const timer = setTimeout(() => setDraftSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [
    studentName,
    fatherName,
    selectedClassId,
    selectedSessionId,
    group,
    selectedSubjects,
    parentCell,
    studentCell,
    address,
    admissionDate,
    totalFee,
    paidAmount,
    isCustomFeeMode,
  ]);
```

---

### **Step 2: Update createStudentMutation onSuccess (Line 228-232)**

**Replace this**:
```typescript
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setSavedStudent(data.data);
      triggerConfetti();
      setSuccessModalOpen(true);
    },
```

**With this**:
```typescript
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setSavedStudent(data.data);
      
      // TASK 3: Clear draft after successful save
      localStorage.removeItem(ADMISSION_DRAFT_KEY);
      console.log('🗑️ Draft cleared after successful save');
      
      triggerConfetti();
      setSuccessModalOpen(true);
    },
```

---

### **Step 3: Update handleCancel Function (Line 332-346)**

**Replace this**:
```typescript
  const handleCancel = () => {
    setStudentName("");
    setFatherName("");
    setSelectedClassId("");
    setSelectedSessionId("");
    setGroup("");
    setSelectedSubjects([]);
    setParentCell("");
    setStudentCell("");
    setAddress("");
    setAdmissionDate(new Date().toISOString().split("T")[0]);
    setTotalFee("");
    setPaidAmount("");
    setIsCustomFeeMode(false);
  };
```

**With this**:
```typescript
  // TASK 3: Reset form and clear draft
  const handleResetForm = () => {
    setStudentName("");
    setFatherName("");
    setSelectedClassId("");
    setSelectedSessionId("");
    setGroup("");
    setSelectedSubjects([]);
    setParentCell("");
    setStudentCell("");
    setAddress("");
    setAdmissionDate(new Date().toISOString().split("T")[0]);
    setTotalFee("");
    setPaidAmount("");
    setIsCustomFeeMode(false);
    
    // Clear localStorage draft
    localStorage.removeItem(ADMISSION_DRAFT_KEY);
    console.log('🗑️ Draft manually cleared');
  };
  
  const handleCancel = handleResetForm;
```

---

### **Step 4: Add "Draft Saved" UI Indicator (Inside HeaderBanner, after subtitle)**

Find the HeaderBanner component (around line 352-370) and update the subtitle to include draft indicator:

**Replace this**:
```typescript
      <HeaderBanner
        title="New Admission"
        subtitle="Register a new student to the academy"
      >
```

**With this**:
```typescript
      <HeaderBanner
        title="New Admission"
        subtitle={
          <div className="flex items-center gap-2">
            <span>Register a new student to the academy</span>
            {draftSaved && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <CheckCircle2 className="h-3 w-3" />
                Draft saved
              </span>
            )}
          </div>
        }
      >
```

---

## **Summary of Changes**

| Task | Location | Action |
|------|----------|--------|
| **Task 1** | After line 105 | Add load & save draft hooks |
| **Task 2** | Line 358 (HeaderBanner) | Add "Draft saved" indicator |
| **Task 3** | Line 228 (onSuccess) | Clear draft after successful save |
| **Task 3** | Line 332 (handleCancel) | Add `handleResetForm` and clear draft |

---

## **Expected Behavior**

1. **On Page Load**: Form auto-fills from localStorage if draft exists
2. **As User Types**: Draft saves automatically (with 2s indicator)
3. **On Successful Save**: Draft is cleared from localStorage
4. **On Cancel**: Draft is cleared and form is reset
5. **Quick Add Modal**: Does NOT interact with main form draft (isolated)

---

## **Testing Steps**

1. Start filling the admission form
2. See "Draft saved" appear briefly after changes
3. Navigate away from the page
4. Return to Admissions page
5. **Verify**: Form is pre-populated with draft data
6. Submit the form successfully
7. **Verify**: Draft is cleared (form is empty on next visit)

---

**Status**: Ready for implementation  
**Complexity**: Medium (localStorage + React hooks)  
**Safety**: High (no data loss on navigation)
