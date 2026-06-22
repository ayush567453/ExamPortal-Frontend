import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/services/library.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-library-members',
  templateUrl: './library-members.component.html',
  styleUrls: ['./library-members.component.css']
})
export class LibraryMembersComponent implements OnInit {
  members: any[] = [];
  filtered: any[] = [];
  searchQ = '';
  showForm = false;
  editMode = false;
  saving = false;

  form: any = { name: '', email: '', phone: '', address: '', studentClass: '', status: 'ACTIVE' };

  constructor(private lib: LibraryService, private snack: MatSnackBar) {}

  ngOnInit() { this.load(); }

  load() {
    this.lib.getMembers().subscribe((m: any) => {
      this.members = m;
      this.applyFilter();
    });
  }

  applyFilter() {
    if (!this.searchQ.trim()) { this.filtered = this.members; return; }
    const q = this.searchQ.toLowerCase();
    this.filtered = this.members.filter(m =>
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.phone?.includes(q)
    );
  }

  openAdd() { this.form = { name: '', email: '', phone: '', address: '', studentClass: '', status: 'ACTIVE' }; this.editMode = false; this.showForm = true; }

  openEdit(m: any) { this.form = { ...m }; this.editMode = true; this.showForm = true; }

  save() {
    if (!this.form.name) { this.snack.open('Name is required', '', { duration: 2000 }); return; }
    this.saving = true;
    const obs = this.editMode ? this.lib.updateMember(this.form.id, this.form) : this.lib.addMember(this.form);
    obs.subscribe(() => {
      this.snack.open(this.editMode ? 'Member updated!' : 'Member added!', '', { duration: 2000 });
      this.showForm = false; this.saving = false; this.load();
    }, () => { this.saving = false; });
  }

  delete(id: number) {
    if (!confirm('Delete this member?')) return;
    this.lib.deleteMember(id).subscribe(() => { this.snack.open('Member deleted', '', { duration: 2000 }); this.load(); });
  }

  getInitial(name: string) { return name ? name[0].toUpperCase() : '?'; }
}
